// Create an S3 Bucket Policy with private write/list and public read permissions
export function bucketPolicy(bucketName: string, lambdaRole: string) {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: lambdaRole,
        },
        Action: ["s3:PutObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
      {
        Effect: "Allow",
        Principal: {
          AWS: lambdaRole,
        },
        Action: ["s3:ListBucket"],
        Resource: [`arn:aws:s3:::${bucketName}`],
      },
      {
        Effect: "Deny",
        Action: ["s3:GetObject"],
        Principal: "*",
        Resource: [`arn:aws:s3:::${bucketName}/*`],
        Condition: {
          NotIpAddress: {
            "aws:SourceIp": [
              "164.97.246.192/28",
              "20.36.64.0/19",
              "20.36.112.0/20",
              "20.39.72.0/21",
              "20.39.96.0/19",
              "40.82.12.0/22",
              "40.82.244.0/22",
              "40.90.130.32/28",
              "40.90.142.64/27",
              "40.90.149.32/27",
              "40.126.128.0/18",
              "52.143.218.0/24",
              "52.239.218.0/23",
              "20.36.32.0/19",
              "20.36.104.0/21",
              "20.37.0.0/16",
              "20.38.184.0/22",
              "20.39.64.0/21",
              "40.82.8.0/22",
              "40.82.240.0/22",
              "40.90.130.48/28",
              "40.90.142.96/27",
              "40.90.149.64/27",
              "52.143.219.0/24",
              "52.239.216.0/23",
              "101.167.226.80/28",
              "101.167.229.80/28",
              "164.97.245.84/32",
              "162.145.253.0/24",
              "20.37.10.126/32",
              "52.63.239.67/32",
              "13.237.226.46/32"
            ]
          }
        },
      }
    ],
  });
}
