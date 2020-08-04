import * as React from 'react';
import './App.scss';
import { fromEvent, from } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { getUsers } from '../utils/user.service';

const App = () => {

    const [ text1, setText1 ] = React.useState('');

    const [ result, setResult ] = React.useState('');

    const [ resultRxjs, setResultRxjs ] = React.useState('');

    const text1Ref = React.useRef(null);

    React.useEffect(() => {
        /**
         * Thực hiện search với rxjs
         * Chỉ thực hiện search khi người dùng ngưng nhập trong 1 khoảng thời gian 500ms
         * Chỉ thực hiện search khi hai giá trị search liên tiếp khác nhau
         * Nếu người dùng tiếp tục nhập vào ô input, thì cancel những lần request trước và chỉ lấy request gần nhất
         * => Giảm số lượng request client gửi lên server 
         * Kết quả nhận được luôn là kết quả của lần serch sau cùng
         */
        const sub = fromEvent(text1Ref.current, 'input').pipe(
            pluck('target', 'value'),
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => console.log('Search request with rxjs')),
            switchMap((val: string) => from(getUsers(val)))
        ).subscribe((val: string) => {
            setResultRxjs(val);
        })

        return () => {
            sub.unsubscribe();
        }
        
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setText1(value);

        /**
         * Với mỗi lần input change thì client sẽ make 1 search request
         * Điều này dẫn tới việc quá tải cho backend vì phải xử lý nhiều request
         * Kết quả của các search request trung gian đều vô nghĩa
         * Giả sử người dùng cần search với text value: propzy
         * Client sẽ thực hiện 6 request
         * Trong đó kết quả của những search request p, pr, pro, prop, propz là vô nghĩa
         * Giả sửa backend mất 10s để xử lý kết quả search propz và 2s để xử lý kết quả propzy
         * Vậy kết quả sau cùng người dùng nhận được là kết quả của lần search 'propz' chứ không phải 'propzy' => sai
         * 
         */
        console.log('Search 1 request'); 
        getUsers(value).then((res: string) => {
            setResult(res);
        })
    }

    return (
        <div className='container'>
            <input 
                type='text' 
                placeholder='Search without rxjs' 
                value={text1} 
                ref={text1Ref} 
                onChange={handleChange}
            />

            <div>Result of search: {result}</div>

            <div>Result of search using rxjs: {resultRxjs}</div>
            
        </div>
    )
}

export default App;
