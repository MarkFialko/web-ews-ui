import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { dictionaryApi } from "./dictionaryApi";

export function usePrefetchDictionaries() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dictionaryApi.endpoints.getCloseCodes.initiate(undefined));
    dispatch(dictionaryApi.endpoints.getIncReason.initiate(undefined));
    dispatch(dictionaryApi.endpoints.getLateReason.initiate(undefined));
  }, [dispatch]);
}
