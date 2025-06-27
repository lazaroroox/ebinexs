import { useContext } from "react";
import ApiContext from "../contexts/v2/ApiContext";

const useApiData = () => useContext(ApiContext);

export default useApiData;
