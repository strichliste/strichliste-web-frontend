import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, AppState } from './store';

/** Typed react-redux hooks for the client/UI state slices. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
