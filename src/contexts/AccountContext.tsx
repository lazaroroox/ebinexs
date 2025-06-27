import { FC, ReactNode, createContext, useEffect, useState } from "react";
import useApiData from "src/hooks/useApiData";
import { saveAccountId } from "src/services/db";
import useAccounts from "src/swr/use-accounts";
import { Account } from "src/types";
import { checkActiveAccountActive } from "src/utils";
import { useLocalStorage } from "usehooks-ts";

interface AccountProviderProps {
  children: ReactNode;
}

interface AccountContextValue {
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  activeAccount: Account | null;
  setActiveAccount: (account: Account) => void;
  mutate: (key: string) => void;
}

const AccountContext = createContext<AccountContextValue>({
  accounts: [],
  setAccounts: () => null,
  activeAccount: null,
  setActiveAccount: () => null,
  mutate: () => null,
});

export const AccountProvider: FC<AccountProviderProps> = (props) => {
  const { children } = props;

  const { userBalance } = useApiData();
  const { accountsList, mutate } = useAccounts();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsStorage, setAccountsStorage] = useLocalStorage(
    "accountsStorage",
    null
  );
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (accountsList) {
      const accountsOptions = accountsList
        .filter(
          (item) => item.environment !== "GLOBAL" && item.environment !== "SPOT"
        )
        .map((account) => {
          return {
            ...account,
            value: account.id,
          };
        });

      const { accountId, activeAccount } =
        checkActiveAccountActive(accountsOptions);
      saveAccountId("ebinex:accountId", accountId);
      setActiveAccount(activeAccount);
      setAccounts(accountsOptions);
      setAccountsStorage(accountsOptions);
    }
  }, [accountsList]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        setAccounts,
        activeAccount,
        setActiveAccount,
        mutate,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
