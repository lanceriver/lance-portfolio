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

## Retire the old site

Delete only after cutover is verified:

- S3 bucket `lanceriver.com`
- CloudFront distribution `EAKMWW6S5Z3KD`
- IAM role `GitHubAction-AssumeRoleWithAction`
- DynamoDB table `lancerivervisitor_counter`
- CloudFormation stacks `v1`, `v1point1`, `v1point2`, `testingWebsiteStack`, `hello`, and `helloooo`
- Orphaned Route 53 hosted zone `Z045884510L49TOC5SLX0`
