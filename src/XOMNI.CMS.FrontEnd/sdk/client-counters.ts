/// <reference path="core.ts" />
module Xomni.Private.Analytics.ClientCounters {
    export class ClientCounterClient extends BaseClient {
        private clientCounterUri: string = '/private/analytics/clientcounters';

        getClientCounterList(success: (result: ClientCounterListContainer) => void, error: (error: any) => void, continuationKey?: string) {
            var uri = this.clientCounterUri;
            if (continuationKey != undefined) {
                uri = uri + '?continuationKey=' + continuationKey;
            }
            this.httpProvider.get(uri, success, error);
        }
    }

    export interface ClientCounterListContainer {
        ContinuationToken: string;
        CounterNames: string[];
    }
}