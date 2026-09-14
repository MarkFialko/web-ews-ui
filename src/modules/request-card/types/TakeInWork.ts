export type TakeInWorkDTO = {
  businessId: string;
  taskId: string;
};

export type WithUserTN<T> = T & { employeeNumber: string };
