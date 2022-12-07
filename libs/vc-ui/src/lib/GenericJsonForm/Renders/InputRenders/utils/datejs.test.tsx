
import { createOnChangeHandler } from './datejs';
import dayjs from 'dayjs';

describe('datejs', () => {
  it('should render', () => {
    const mockCallback = jest.fn();
    const onDateChange = createOnChangeHandler("#/values", mockCallback, 'YYYY-MM-DD HH:mm');
    onDateChange(dayjs('2022-12-12 12:12'),  '2022-12-12 12:12');

    expect(mockCallback).toBeCalledWith("#/values", '2022-12-12 12:12');
  });
});
