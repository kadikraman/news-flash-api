/// <reference types="node" />
import { GraphQLOptions } from 'apollo-server-core';
import { RequestHandler } from 'micro';
import { IncomingMessage } from 'http';
import { ValueOrPromise } from 'apollo-server-types';
export interface MicroGraphQLOptionsFunction {
    (req?: IncomingMessage): ValueOrPromise<GraphQLOptions>;
}
export declare function graphqlMicro(options: GraphQLOptions | MicroGraphQLOptionsFunction): RequestHandler;
//# sourceMappingURL=microApollo.d.ts.map