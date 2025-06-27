import { useContext, useEffect, useMemo, useState } from "react";
import { appConfig } from "src/config";
import LayoutContext from "src/contexts/LayoutContext";
import { apiGet } from "src/services/apiService";
import { User } from "src/types/user";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

export default function useUser() {
  const [userStorage, setUserStore] = useLocalStorage("userStorage", null);
  const { data, isValidating, mutate } = useSWR<User>("/users", apiGet, {
    dedupingInterval: 10000,
  });
  const { layout, setAccountValidate, setEnableEditAccount } =
    useContext(LayoutContext);
  const [accountValidationStorege] = useLocalStorage(
    "accountValidationStorege",
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && !layout.enableEditAccount) {
      setUserStore(data);
      checkUser(data);
    }
  }, [data]);

  const checkUser = (user: User) => {
    if (user.verified) {
      setAccountValidate({ finish: true });
      setEnableEditAccount(false);
    } else {
      if (!accountValidationStorege) {
        setAccountValidate({ finish: false, activeForm: "documment" });
      } else {
        setAccountValidate(accountValidationStorege);
      }

      setEnableEditAccount(false);
    }
  };

  const user = useMemo(() => {
    if (data) {
      return {
        ...data,
        avatar: `${appConfig.api_url}/users/avatar/${
          data.id
        }/avatar.jpeg?timestamp=${new Date().getTime()}`,
      };
    }
    return null;
  }, [data]);

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  const isAdmin = useMemo(() => {
    let isAdmin = false;
    if (user) {
      isAdmin = [
        "leodeveloper13@gmail.com",
        "weboaz@gmail.com",
        "deuzinh2010@gmail.com",
        "julioreis.si@gmail.com",
        "user1@ebinex.com",
      ].includes(user.email);
    }

    return isAdmin;
  }, [user]);

  return {
    user,
    isAdmin,
    loading,
    isValidating,
    mutate,
  };
}
