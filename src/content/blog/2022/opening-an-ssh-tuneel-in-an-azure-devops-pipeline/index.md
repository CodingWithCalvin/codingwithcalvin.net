---
title: "Opening an SSH Tuneel in an Azure DevOps Pipeline"
date: "2022-05-02T12:00:00-05:00"
categories: [azure,devops,ssh]
description: "I needed to be able to open an SSH tunnel in one of my Azure pipelines recently to get access to some databases hosted in AWS for running various integration tests."
subtitle: "Secure database access in CI/CD!"
---

I needed to be able to open an SSH tunnel in one of my Azure pipelines recently to get access to some databases hosted in AWS for running various integration tests.

I knew it had to be possible, as other applications are able to open tunnels. The one item that held me up for a while was actually putting the connection into the background so that the pipeline could continue running - generally an SSH connection will block.

After some back and forth with a teammate, Google, Bing, StackOverflow, etc., I finally happened upon the command to make it all work.

This is a bash command running on an Ubuntu runner, that opens an SSH connection to a Bastion in AWS using a key file and maps the postgres database default port - 5432 - to a local port of 5432. All the parameters are standard for SSH, except for the last one. The last parameter is instructing the command to sleep for 120 seconds (`sleep` is a standard Linux command). And while that is a finite period of time - it is simply telling the connection to stay open for 120 seconds **UNTIL** something else uses the connection.  In my case, the very next step in the pipeline opened a database connection, so I never had any issues with timeouts.

```yaml
- task: Bash@3
    displayName: "Creating SSH Tunnel for Postgres Database..."
    inputs:
      targetType: 'inline'
      script: |
        ssh -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no -fN -i '$(System.DefaultWorkingDirectory)/SSH Keys/bastion.pem' -L 5432:postgres-database.us-east-2.rds.amazonaws.com:5432 ec2-user@ec2-1-1-1-1.us-east-2.compute.amazonaws.com sleep 120 &
```

With that running, you can now connect to your postgres database at localhost:5432 (like you would if you had postgres installed and running locally!)
