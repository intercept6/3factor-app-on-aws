import {
  OperationVariables,
  TypedDocumentNode,
  useSubscription,
  DocumentNode,
  SubscriptionHookOptions,
  SubscriptionResult,
} from '@apollo/client';
import { useEffect, useState } from 'react';

// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/491
export function usePatchedSubscription<
  TData = any,
  TVariables = OperationVariables
>(
  subscription: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: SubscriptionHookOptions<TData, TVariables>
): SubscriptionResult<TData, any> {
  const [delaySub, setDelaySub] = useState(true);

  useEffect(() => {
    let delayTimeoutId: number | null = window.setTimeout(() => {
      setDelaySub(false);
      delayTimeoutId = null;
    }, 2_000);

    return () => {
      if (delayTimeoutId) {
        window.clearTimeout(delayTimeoutId);
      }
    };
  }, []);

  return useSubscription(subscription, {
    ...options,
    skip: delaySub,
  });
}
