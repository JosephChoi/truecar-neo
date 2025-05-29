// OrderForm에서 사용하는 데이터 타입과 유틸리티 함수

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  carModel: string;
  budget: string;
  mileage: string;
  preferredColor: string;
  repairHistory: string;
  carUrl: string;
  message: string;
}

export interface OrderDetail {
  vehicleType: string;
  budget: string;
  mileage: string;
  preferredColor: string;
  repairHistory: string;
  referenceSite: string;
}

// OrderFormData를 OrderDetail로 변환하는 함수
export function convertFormDataToOrderDetail(formData: OrderFormData): OrderDetail {
  return {
    vehicleType: formData.carModel || '',
    budget: formData.budget || '',
    mileage: formData.mileage || '',
    preferredColor: formData.preferredColor || '',
    repairHistory: formData.repairHistory || '',
    referenceSite: formData.carUrl || ''
  };
} 