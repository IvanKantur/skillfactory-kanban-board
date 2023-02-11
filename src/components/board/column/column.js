import css from './column.module.scss';
import Scrollbars from "react-custom-scrollbars-2";
import {useLayout} from "../../../hooks/layout/use-layout";
import {useTasks} from "../../../hooks/tasks/use-tasks";
import {Card} from "./card/card";
import {useState} from "react";
export const Column = (props) => {
    const [isNewTaskInputShown, setIsNewTaskInputShown] = useState(false);
    const [isNewTaskSelectShown, setIsNewTaskSelectShown] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(undefined);

    const [cardName, setCardName] = useState();
    const {mainContentHeight} = useLayout();
    const {getTasksByState, getTasksByExcludedState, addTask, moveTask } = useTasks();

    const tasks = getTasksByState(props.state);
    const hasTasks = tasks.length > 0;

    const onInputCard = (e) => {
        setCardName(e.target.value);
    }

    return (
        <div className={css.column}>
            <div className={css.header}>{props.name}</div>
            <div className={css.wrapper}>
                <div className={css.body}>
                    {hasTasks &&
                    <Scrollbars autoHeightMax={mainContentHeight} autoHide autoHeight>
                        {tasks.map((task) => <Card key={task.id} name={task.name}/>)}
                    </Scrollbars>
                    }
                    {isNewTaskInputShown &&
                    <div>
                        <input onInput={onInputCard} />
                    </div>
                    }

                    {isNewTaskSelectShown && <select onChange={
                        (e) => setSelectedTaskId(e.target.value)}>
                        <option>Select Task</option>
                        {getTasksByExcludedState(props.state).map((task) =>
                            <option key={task.id} value={task.id}>{task.name}</option>
                        )}
                    </select>}
                </div>
                <div className={css.footer}>
                    {(!isNewTaskInputShown && !isNewTaskSelectShown) && <button onClick={() => props.state === 'backlog'
                        ? setIsNewTaskInputShown(true)
                        : setIsNewTaskSelectShown(true)
                    }>Add Task</button>}
                    {(isNewTaskInputShown || isNewTaskSelectShown) &&
                    <button onClick={() => {
                        if (props.state === 'backlog') {
                            setIsNewTaskInputShown(false)
                            addTask(cardName, 'backlog');
                            setCardName(undefined);
                        } else {
                            setIsNewTaskSelectShown(false);
                            moveTask(selectedTaskId, props.state);
                        }
                    }}
                    >Submit</button>
                    }
                    {(isNewTaskInputShown || isNewTaskSelectShown)
                    && <button onClick={() =>
                        props.state = 'backlog'
                            ? setIsNewTaskInputShown(false)
                            : setIsNewTaskSelectShown(false)
                    }> Hide</button>}
                </div>
            </div>
        </div>
    )
}
