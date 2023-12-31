import TodoItem from "./TodoItem";
import { useState, useEffect } from "react";
import { List } from "@mui/material";
import TodoForm from "./TodoForm";
import Nav from "./Nav";


// getInitialData 함수를 이용하여 로컬 스토리지에 저장된 아이템들을 가지고올 수 있음
// 비어있을 경우 빈 배열 반환
const getInitialData = () => {
    const data = JSON.parse(localStorage.getItem("todos"));
    if(!data) return [];
    return data;
}
export default function TodoList() {
    // useState 를 이용하여 상태를 간편하게 변경할 수 있으며,
    // 컴포넌트가 렌더링 될때마다 새로운 상태로 업데이트할 수 있음
    const [todos, setTodos] = useState(getInitialData());


    // useEffect 를 이용하여 의존성을 추가한다.
    // todos에 변동이 있을 때마다, localStorage에 setItem을 해준다.
    useEffect (() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    // filter 기능을 이용한 삭제 기능 추가
    // id가 같은것을 제외하고 다시 보여준다.
    const deleteTodo = (id) => {
        setTodos((prevTodos) => {
            return prevTodos.filter((t) => t.id !== id)
        });
    }

    // map을 이용하여 체크 박스에 체크 기능 추가
    // 선택된 id와 같은 t의 completed 속성을 반대로 바꿔준다.
    // 아닌것은 그대로 t를 출력
    const checkTodo = (id) => {
        setTodos((prevTodos) => {
            return prevTodos.map((t) => {
                if (t.id === id) {
                    return { ...t, completed: !t.completed };
                }
                return t;
            })
        })
    }
    // Nav의 + 버튼을 눌러 생성 TodoForm 을 보여주어, 추가할 수 있다.
    const [visible, setVisible] = useState(false);
    const toggleVisible = () => {
        setVisible(!visible);
    }

    // 입력 받은 text 값을 todos에 추가한다.
    // crypto.randomUUID로 랜덤 아이디를 만들어준다.
    const saveTodo = (text) => {
        setTodos((prevTodos) => {
            return [...prevTodos, {id: crypto.randomUUID(), text: text, completed: false}];
        });
    }

    // TodoItem 수정 기능 추가
    const editTodo = (text, id) => {
        setTodos((prevTodos) => {
            return prevTodos.map((t) => {
                if (t.id === id) {
                    return {...t, text: text };
                }
                return t;
            })
        });
    }
    return (
        // Material UI의 List를 이용하여 쉽게 리스트를 가지고옴.
        // map을 이용하여 todos의 array를 하나씩 불러와 TodoItem으로 보내준다.
        // 이때 키값으로 todo.id를 이용한다.
        // Todo Item에서는 todo 값을 {todo}로 받아 사용해야 한다.
        // 생성한 deleteTodo(), checkTodo() 에 todo.id를 넣어 TodoItem으로 보내준다.
        // Nav의 + 버튼을 눌러 addForm을 실행한다.
        // 생성된 빈 Form은 {form}위치에 배치된다.
        <>
        <Nav toggleVisible={toggleVisible}/>
        {visible && <TodoForm saveTodo={saveTodo} toggleVisible={toggleVisible}/>}
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {todos.map((todo) =>
                <TodoItem key={todo.id} todo={todo}
                    deleteTodo={() => deleteTodo(todo.id)}
                    checkTodo={() => checkTodo(todo.id)}
                    editTodo={editTodo} />
            )}
        </List>
        </>
    );
}