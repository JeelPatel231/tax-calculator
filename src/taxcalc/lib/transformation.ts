export type DataReturnType = {
  message: string[];
  amount: number;
};

export type Transformation<T> = (
  details: T,
  value: number,
) => Promise<DataReturnType>;

export type RebateAddition<T> = T & { incomeAfterDeduction: number };
