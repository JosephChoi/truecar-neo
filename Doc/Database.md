트루카 데이터 베이스 관리지침 

맞춤주문하기 버튼
-	맞춤주문하기 버튼을 클릭 시 정보는 구글시트로 연동하여 진행하고
-	구글시트에는 구글 스크립트를 활용해서 기록과 동시에 관리자와 고객에게 각각 주문등록/ 주문완료에 대한 안내메세지가 전달된다. 

리뷰관리
-	리뷰관리는 수파베이스 데이터 테이블과 스토리지를 활용하여 구축
-	리뷰관리페이지: /admin으로 관리자가 로그인을 하고 /admin/reviews페이지로 이동하면 해당 페이지에 리뷰목록이 존재한다.
-	리뷰목록에는 리뷰상세페이지에 들어갈 정보들을 입력하며 등록/수정/삭제할 수 있다. 
-	리뷰테이블 정보는 수파베이스 리뷰테이블에 작성되고 이미지정보는 스토리지에 저장된다. 
-	관리자는 별도로 지정한 1인이 있으면 추가시 수파베이스에서 수동으로 사용자를 입력하고 
-	입력된 사용자는 SQL에디터를 통해 관리자 지정을 별도로 지정해준다.
