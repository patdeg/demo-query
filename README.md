# demo-query

# AWS Query Demo

Showcasing online SQL editor using tiny SQLite database

# Prerequisites

Install AWS CLI following https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html, and Elastic Beanstalk CLI with:

```
pip install awsebcli --upgrade --user
```

# Configure AWS & Elastic Beanstalk 

Set up AWS CLI with:

```
aws configure
```

Set up Elastic Beanstalk in the cloned folder:

```
cd demo-query
eb init
eb create
```

# Deploy the application

You deploy the application to Elastic Beanstalk with

```
eb deploy
```

