import { useWorklogFlusher } from "../hooks/useWorklogFlusher";

/**
 * Provider создаётся внутри AppRoot: useWorklogFlusher вызывает useAppDispatch,
 * а redux-контекст доступен только дочерним компонентам Provider.
 * В теле AppRoot контекста ещё нет, поэтому хук вынесен в отдельный компонент.
 */
export function WorklogFlusher() {
  useWorklogFlusher();
  return null;
}
