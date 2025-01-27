import feedReducer, { initialState } from './slice';
import { userOrders } from '../mockData';
import { getFeedsThunk, getOrderByNumberThunk } from './actions';
import { TFeedsResponse, TOrderResponse } from '../../../utils/burger-api';

describe('Тесты асинхронных экшенов', () => {
  describe('Тестируем getFeedsThunk', () => {
    test('Тестируем отправку запроса (pending)', async () => {
      const newState = feedReducer(
        initialState,
        getFeedsThunk.pending('pending')
      );

      expect(newState.isFeedsLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });
    test('Тестируем ошибку при запросе (rejected)', async () => {
      const error: Error = {
        name: 'rejected',
        message: 'Ошибка выгрузки заказов'
      };
      const newState = feedReducer(
        initialState,
        getFeedsThunk.rejected(error, 'rejected')
      );

      expect(newState.isFeedsLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Тестируем успешный запрос (fulfilled)', async () => {
      const feeds: TFeedsResponse = {
        orders: userOrders,
        total: 10,
        totalToday: 20,
        success: true
      };

      const newState = feedReducer(
        initialState,
        getFeedsThunk.fulfilled(feeds, 'fulfilled')
      );

      expect(newState.orders).toEqual(userOrders);
      expect(newState.total).toEqual(10);
      expect(newState.totalToday).toEqual(20);
      expect(newState.isFeedsLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });

  describe('Тестируем отправку запроса getOrderByNumberThunk', () => {
    test('Тестируем отправку запроса (pending)', async () => {
      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.pending('pending', 1)
      );

      expect(newState.isOrderLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Тестируем ошибку при запросе (rejected)', async () => {
      const error: Error = {
        name: 'rejected',
        message: 'Ошибка выгрузки конкретного заказа'
      };
      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.rejected(error, 'rejected', 1)
      );

      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Тестируем успешный запрос (fulfilled)', async () => {
      const orders: TOrderResponse = {
        orders: [userOrders[0]],
        success: true
      };

      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.fulfilled(orders, 'fulfilled', 1)
      );

      expect(newState.order).toEqual(userOrders[0]);
      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
