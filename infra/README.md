# AWS hosting runbook

All commands below are run from `infra/`. The stack uses only the live hosted zone `Z08238469JD0YFW9R421` and the existing GitHub OIDC provider.

## Provision the independent stack

```sh
cd infra
AWS_PROFILE=admin sam build
AWS_PROFILE=admin sam deploy --stack-name lance-portfolio --region us-east-1 --capabilities CAPABILITY_IAM --resolve-s3
```

Read the stack outputs:

```sh
AWS_PROFILE=admin aws cloudformation describe-stacks --stack-name lance-portfolio --region us-east-1 --query 'Stacks[0].Outputs' --output table
```

Seed the new counter with the old site's count:

```sh
AWS_PROFILE=admin aws dynamodb put-item --region us-east-1 --table-name <VisitsTable> --item '{"id":{"S":"site"},"count":{"N":"1330"}}'
```

Set the four repository variables using the values from the stack outputs:

```sh
gh variable set AWS_DEPLOY_ROLE_ARN --body '<DeployRoleArn>' --repo lanceriver/lance-portfolio
gh variable set SITE_BUCKET --body '<SiteBucketName>' --repo lanceriver/lance-portfolio
gh variable set CF_DISTRIBUTION_ID --body '<DistributionId>' --repo lanceriver/lance-portfolio
gh variable set VISITS_API_URL --body '<VisitsApiUrl>' --repo lanceriver/lance-portfolio
```

Start the first deployment from GitHub Actions with **Deploy site → Run workflow** on `main` (workflow dispatch).

## Connect read-only Spotify now playing

The stack adds `GET /now-playing` to the existing HTTP API and reports the current track, or the most recently played track with `playing: false`. The JSON response contains `playing`, `title`, `artist`, `url`, and `art`; `art` is the first valid `https://i.scdn.co/image/<alphanumeric>` album image URL or `null`. The endpoint only requests `user-read-currently-playing` and `user-read-recently-played`. It returns an empty stopped state when playback is unavailable and never exposes device, account, or token data.

1. In the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), create an app. In its settings, add exactly `http://127.0.0.1:8888/callback` as a redirect URI. Spotify accepts the loopback IP form; use `127.0.0.1`, not `localhost`.
2. Copy the app's **Client ID**. It is a public app identifier, not a client secret. This integration uses Authorization Code with PKCE and does not need a client secret.
3. From the repository root, run the local authorization helper. It opens Spotify sign-in, listens only on `127.0.0.1:8888`, and stores the resulting credentials in Parameter Store after Spotify authorizes the two read-only scopes:

   ```sh
   python3 scripts/connect-spotify.py --client-id '<SpotifyClientId>'
   ```

   The command uses the local AWS `admin` profile in `us-east-1`. The browser callback expires after five minutes. OAuth codes and tokens are not printed or logged.
4. Set the GitHub repository variable `NOW_PLAYING_API_URL` to the stack's `NowPlayingApiUrl` output:

   ```sh
   gh variable set NOW_PLAYING_API_URL --body '<NowPlayingApiUrl>' --repo lanceriver/lance-portfolio
   ```

   The first step only applies after a deployment that includes the new stack output. Re-run the helper if Spotify authorization expires (refresh tokens last about six months) or is revoked.

The refresh token and Client ID are stored together as JSON in the Standard SecureString `/lance-portfolio/spotify/credentials`, encrypted by the AWS-managed `aws/ssm` key. The Lambda role can get and replace only that exact parameter; its KMS encrypt/decrypt permissions are restricted to calls through Parameter Store with that parameter's encryption context. The public Client ID is not a secret; the refresh token is. Do not put either token in CloudFormation, Lambda environment variables, source files, logs, or the frontend. The endpoint keeps successful metadata in memory for at most 30 seconds and caches the access token in Lambda memory; Spotify errors return an empty stopped state with HTTP 503 and `Cache-Control: no-store`.

The account's current Lambda concurrency quota does not leave the required 10 unreserved executions if this function reserves one, so it currently uses the shared unreserved pool. The template has a TODO to restore the one-execution reservation when the quota allows at least 10 unreserved executions.

Cost: the Standard Parameter Store value has no storage or standard-throughput API charge. Using the AWS-managed KMS key has no key-storage fee; KMS API usage can be billed under current KMS pricing. Lambda is billed by invocation and execution time (128 MB, with a 15-second maximum); HTTP API requests are also billed. AWS pricing and free-tier eligibility vary by account and can change, so see [Parameter Store pricing](https://aws.amazon.com/systems-manager/pricing/), [KMS pricing](https://aws.amazon.com/kms/pricing/), and [Lambda pricing](https://aws.amazon.com/lambda/pricing/) for current rates. The 30-second cache reduces repeat Spotify calls within a warm execution environment; API Gateway retains its existing 10 requests/second and 20 burst limits.

## Verify the cutover

Replace `<writing-slug>` with a directory from `dist/writing/` and `<VisitsApiUrl>` with the stack output.

```sh
curl -sS -o /dev/null -w '%{http_code}\n' https://lanceriver.com/
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://www.lanceriver.com/
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://lanceriver.com/writing/<writing-slug>
curl -sS -o /dev/null -w '%{http_code}\n' https://lanceriver.com/this-path-does-not-exist
curl -sSI https://lanceriver.com/ | tr -d '\r' | grep -Ei '^(strict-transport-security|x-content-type-options|x-frame-options|referrer-policy):'
curl -i -X OPTIONS '<VisitsApiUrl>' -H 'Origin: https://lanceriver.com' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: content-type'
curl -i -X OPTIONS '<VisitsApiUrl>' -H 'Origin: https://another-origin.example' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: content-type'
```

Expected: apex returns 200; `www` returns 301 to the apex; the slashless writing URL returns 301 to its trailing-slash form; the unknown path returns 404. The first preflight includes `Access-Control-Allow-Origin: https://lanceriver.com`. The second must omit `Access-Control-Allow-Origin` (the browser rejects it even if API Gateway responds 204).

## Old site (retired 2026-10-22)

Deleted after the cutover was verified: S3 bucket `lanceriver.com` (all versions), CloudFront distribution `EAKMWW6S5Z3KD`, IAM roles `GitHubAction-AssumeRoleWithAction` and `LambdaDynamoAPI`, DynamoDB table `lancerivervisitor_counter`, CloudFormation stacks `v1`, `v1point1`, `v1point2`, `testingWebsiteStack`, `hello` and `helloooo`, the standalone counter Lambdas and HTTP APIs, their log groups, the expired ACM certificate and the orphaned hosted zone `Z045884510L49TOC5SLX0`. A local backup of the bucket, the table and the old zone's records is in `~/Documents/aws-old-site-backup-2026-10-22/`.
