// OrderForm에서 OrderDetail로 변환하는 유틸리티 함수

// OrderForm의 데이터 타입 정의
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

// OrderDetail 인터페이스 정의 - 다른 파일에서 이미 정의된 것과 일치시킴
export interface OrderDetail {
  vehicleType: string;
  budget: string;
  mileage: string;
  preferredColor: string;
  repairHistory: string;
  referenceSite: string;
  imageUrl?: string;
}

/**
 * OrderForm 데이터를 OrderDetail 인터페이스로 변환합니다.
 * @param formData OrderForm에서 제출된 폼 데이터
 * @param imageUrl 선택적 이미지 URL (있는 경우)
 * @returns OrderDetail 형식으로 변환된 데이터
 */
export function convertFormDataToOrderDetail(
  formData: OrderFormData,
  imageUrl?: string
): OrderDetail {
  return {
    vehicleType: formData.carModel,
    budget: formData.budget,
    mileage: formData.mileage,
    preferredColor: formData.preferredColor,
    repairHistory: formData.repairHistory,
    referenceSite: formData.carUrl,
    imageUrl: imageUrl
  };
} 