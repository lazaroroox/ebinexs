import { Cookies } from "react-cookie";

export const clearAllDataSaved = (keysToKeep = [], forceClear = false) => {
  const STORAGE_FLAG = "cleaned_storage_prod";

  try {
    // Verifica se a limpeza já foi executada
    if (!forceClear && isCleaningAlreadyExecuted(STORAGE_FLAG)) {
      return { removedCount: 0, removedCountCookies: 0, alreadyExecuted: true };
    }

    // Normaliza as chaves a serem mantidas
    const keysToPreserve = normalizeKeysToKeep(keysToKeep, STORAGE_FLAG);

    // Remove cookies
    const removedCountCookies = clearAllCookies();

    // Limpa localStorage
    const removedCount = clearLocalStorageData(keysToPreserve);

    // Marca como executado
    markAsExecuted(STORAGE_FLAG);

    console.log(
      `Limpeza concluída: ${removedCount} itens do localStorage e ${removedCountCookies} cookies removidos`
    );

    return { removedCount, removedCountCookies, alreadyExecuted: false };
  } catch (error) {
    console.error("Erro durante a limpeza de dados:", error);
    return { removedCount: 0, removedCountCookies: 0, error: error.message };
  }
};

/**
 * Verifica se a limpeza já foi executada anteriormente
 */
const isCleaningAlreadyExecuted = (flagKey) => {
  try {
    const hasExecuted = localStorage.getItem(flagKey);
    return hasExecuted === "true";
  } catch (error) {
    console.warn("Erro ao verificar flag de limpeza:", error);
    return false;
  }
};

/**
 * Normaliza e valida as chaves que devem ser preservadas
 */
const normalizeKeysToKeep = (keysToKeep, storageFlag) => {
  const keysArray = Array.isArray(keysToKeep) ? keysToKeep : [keysToKeep];

  if (!keysArray.includes(storageFlag)) {
    keysArray.push(storageFlag);
  }

  return keysArray.filter((key) => typeof key === "string" && key.length > 0);
};

const clearAllCookies = () => {
  let removedCount = 0;

  try {
    const cookies = new Cookies();
    const allCookies = cookies.getAll();
    const possibleDomains = [window.location.hostname, ".ebinex.com"];
    const possiblePaths = ["/", "/app", "/admin"];

    Object.keys(allCookies).forEach((cookieKey) => {
      possibleDomains.forEach((domain) => {
        possiblePaths.forEach((path) => {
          try {
            cookies.remove(cookieKey, { path, domain });
            removedCount++;
          } catch (error) {
            // Ignora erros de remoção individual de cookies
          }
        });
      });
    });
  } catch (error) {
    console.warn("Erro ao limpar cookies:", error);
  }

  return removedCount;
};

const clearLocalStorageData = (keysToPreserve) => {
  let removedCount = 0;

  try {
    const allKeys = Object.keys(localStorage);
    const keysToRemove = allKeys.filter((key) => !keysToPreserve.includes(key));

    keysToRemove.forEach((key) => {
      try {
        const success = resetLocalStorageValue(key);
        if (success) {
          removedCount++;
        }
      } catch (error) {
        console.warn(`Erro ao processar chave "${key}":`, error);
      }
    });
  } catch (error) {
    console.error("Erro ao acessar localStorage:", error);
  }

  return removedCount;
};

const resetLocalStorageValue = (key) => {
  try {
    const currentValue = localStorage.getItem(key);

    if (currentValue === null) {
      return false;
    }

    // Tenta fazer parse do valor
    let parsedValue;
    try {
      parsedValue = JSON.parse(currentValue);
    } catch {
      localStorage.setItem(key, "");
      return true;
    }

    const defaultValue = getDefaultValueByType(parsedValue);

    if (defaultValue !== null) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } else {
      localStorage.removeItem(key);
    }

    return true;
  } catch (error) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

const getDefaultValueByType = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return null;
    case "object":
      return Array.isArray(value) ? [] : null;
    default:
      null;
  }
};

const markAsExecuted = (flagKey) => {
  try {
    localStorage.setItem(flagKey, "true");
  } catch (error) {
    console.warn("Erro ao marcar limpeza como executada:", error);
  }
};
