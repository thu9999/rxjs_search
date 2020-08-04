# rxjs_search
Issues

Khi thực hiện search, mỗi khi có sự kiện input onchange thì client sẽ tạo 1 request lên server.
- Giả sử người dùng cần tìm kiếm từ khóa propzy, thì client sẽ thực hiện 6 requests với các từ khóa tương ứng: 'p', 'pr', 'pro', 'prop', 'propz', và 'propzy'.
- Điều này dẫn tới một số nhược điểm như:
+ Client thực hiện quá nhiều request lên server. Càng nguy hiểm nếu như server cần nhiều thời gian và tài nguyên khi phải thực hiện các request này.
+ Kết quả của các lần search trung gian ('p', 'pr', 'pro', 'prop', 'propz') là vô nghĩa vì người dùng chỉ cần kết quả của lần tìm kiếm cuối cùng 'propzy'
+ Trong một số trường hợp do delay( có thể do backend hoặc do network) mà kết quả của lần search trung gian (giả sử 'propz') trả về sau cùng => người dùng nhận được kết quả sai
vì khi này kết quả của lần search với từ khóa 'propz' lại trả về cho lần search với từ khóa 'propzy'

Expected
- Client không thực hiện quá nhiều request khi tìm kiếm.
- Kết quả nhận được luôn là kết quả của lần tìm kiếm sau cùng.

Keys

- Sử dụng rxjs để xử lý asynchronous
- debounceTime: Chỉ thực hiện tìm kiếm khi người dùng ngừng nhập trong 1 khoảng thời gian
- switchMap: Cancel những request trước và chỉ giữ lại 1 request sau cùng
- distinctUntilChanged: Chỉ thực hiện tìm kiếm khi hai giá trị tìm kiếm liên tiếp khác nhau
