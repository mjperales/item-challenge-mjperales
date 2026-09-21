import * as cdk from "aws-cdk-lib/core";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { Construct } from "constructs";

interface InfrastructureStackProps extends cdk.StackProps {
  environmentName: "dev" | "prod";
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);

    const { environmentName } = props;

    /* Table */
    const table = new dynamodb.Table(this, "ExamItemsTable", {
      tableName: `exam-items-${environmentName}`,

      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },

      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

      removalPolicy:
        environmentName === "prod"
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
    });

    /* Lambdas */
    const getItemLambda = new lambda.Function(this, "GetItemLambda", {
      functionName: `get-item-${environmentName}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "src.handlers.getItemHandler.handler",

      code: lambda.Code.fromAsset(path.join(__dirname, "../../src/handlers")),
      environment: {
        DYNAMODB_TABLE_NAME: table.tableName,
        ENVIRONMENT: environmentName,
      },
    });

    const createItemLambda = new lambda.Function(this, "CreateItemLambda", {
      functionName: `create-item-${environmentName}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "src.handlers.createItemHandler.handler",

      code: lambda.Code.fromAsset(path.join(__dirname, "../../src/handlers")),

      environment: {
        DYNAMODB_TABLE_NAME: table.tableName,
        ENVIRONMENT: environmentName,
      },
    });

    /* Permissions */
    table.grantReadData(getItemLambda);
    table.grantWriteData(createItemLambda);

    const api = new apigateway.RestApi(this, "ItemApi", {
      restApiName: `item-api-${environmentName}`,

      deployOptions: {
        stageName: environmentName,
      },
    });

    const items = api.root.addResource("items");

    // POST /items
    items.addMethod("POST", new apigateway.LambdaIntegration(createItemLambda));

    const item = items.addResource("{id}");

    // GET /item/{id}
    item.addMethod("GET", new apigateway.LambdaIntegration(getItemLambda));

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
    });

    new cdk.CfnOutput(this, "TableName", {
      value: table.tableName,
    });
  }
}
