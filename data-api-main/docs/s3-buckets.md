# AWS S3 buckets

All user created file content is stored in an AWS S3 bucket in the eu-north-1 (Stockholm) region.

## Setup & naming

There are individual buckets for each environment (development, staging, production). Branch deployments are using the development bucket.

The buckets are named like: `stg-v2-[ENVIRONMENT]`

The bucket access is isolated by having one IAM user per bucket (only has access the contents of that bucket)

The users are named like: `stg-v2-[ENVIRONMENT]-s3-user`

The only policy a user is given is one that gives access to an individual bucket (see below for the JSON).

The policies are named like: `full-access-to-stg-v2-[ENVIRONMENT]-s3-bucket`

## Setting up policies

Prefer to create these policies before creating the users, as then you can just pick the policies while creating users.

- Click `Create policy` in the AWS IAM console
- Go to the JSON editor for the policy, and use the JSON content below, changing the bucket name to match the environment this policy is for (marked with `[ENVIRONMENT]` tag)
- Move on and give the policy a corret name based on environment

### Policy definition in JSON

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:*"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::stg-v2-[ENVIRONMENT]/*"
            ]
        }
    ]
}
```

## Setting up a user

- Click `Add user` in the AWS IAM console
- _don't_ select `Enable console access`
- In the `Set permissions` screen, select only the policy that matches the user based on the environment
- Once user is created, open the user, navigate to `Security credentials` and click on `Create access key`
- Select `Command Line Interface (CLI)`
- Copy the `Access key` and `Secret access key` values

## Setting up a bucket

- Click `Create bucket`in AWS S3 console
- Give name based on environment and select proper region (eu-north-1)
- Set `ACLs disabled`
- Set `Block all public access`
- Disable bucket versioning
- Set `SSE-S3` encryption key type (bucket key enabled)
- Disable object lock
- When the bucket has been created open it up and go to `Permissions` tab
- Copy over the bucket policy JSON from below
- Change the user names and bucket names to match the environment (the code below has `[ENVIRONMENT]` tag on places that need the change). Double check that the first part of the AWS ARN also matches, since these are account specific. Users full ARN can be found from the user page in them IAM console.


### S3 bucket policy JSON

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::643000180729:user/stg-v2-[ENVIRONMENT]-s3-user"
            },
            "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::stg-v2-[ENVIRONMENT]"
        },
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::643000180729:user/stg-v2-[ENVIRONMENT]-s3-user"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::stg-v2-[ENVIRONMENT]/*"
        }
    ]
}
```