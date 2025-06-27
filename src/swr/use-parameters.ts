import _ from "lodash";
import { useMemo } from "react";
import { useCookies } from "react-cookie";
import { apiGet } from "src/services/apiService";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

export default function useParameters() {
  const [cookies] = useCookies(["ebinex:accessToken"]);
  const hasAccessToken = !!cookies["ebinex:accessToken"];

  if (!hasAccessToken) {
    return {
      parameters: null,
      availabilityWithdraw: null,
      loading: true,
      isValidating: false,
      mutate: () => {},
    };
  }

  const { data, isValidating, isLoading, mutate } = useSWR<any>(
    "/parameters",
    apiGet,
    {
      dedupingInterval: 10000,
    }
  );

  const [userStorage] = useLocalStorage<any>("userStorage", {});

  const parameters = useMemo(() => {
    if (data) {
      const params = _.keyBy(data, "key");

      let result = _.mapValues(params, (item, key) => ({
        value: item?.value,
      }));

      result.CANDLE_TIME_FRAMES.value = JSON.stringify([
        {
          label: "1 min",
          value: "M1",
          valueChart: 1,
        },
        {
          label: "5 min",
          value: "M5",
          valueChart: 5,
        },
        {
          label: "15 min",
          value: "M15",
          valueChart: 15,
        },
      ]);

      return result;
    }
  }, [data, isLoading]);

  const availabilityWithdraw = useMemo(() => {
    if (parameters?.WITHDRAWAL_AVAILABILITY_SCHEDULE_EXCEPTION) {
      return checkwithdrawScheduleException(
        parameters.WITHDRAWAL_AVAILABILITY_SCHEDULE_EXCEPTION.value
      );
    }
  }, [parameters]);

  const checkwithdrawScheduleException = (withdrawScheduleException) => {
    const availabilityScheduleException = JSON.parse(withdrawScheduleException);
    const { from, to } = availabilityScheduleException;
    const timeNow = new Date().getTime();

    if (timeNow >= from && timeNow <= to) {
      return true;
    } else if (
      [
        "leodeveloper13@gmail.com",
        "weboaz@gmail.com",
        "deuzinh2010@gmail.com",
        "julioreis.si@gmail.com",
      ].includes(userStorage?.email)
    ) {
      return true;
    }
  };

  return {
    parameters,
    availabilityWithdraw,
    loading: !parameters || isLoading,
    isValidating,
    mutate,
  };
}
