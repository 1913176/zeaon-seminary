import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const TestDetails = ({ testId, closeTest }) => {

    const testData = useLocation()?.state

    const [currentTest, setCurrentTest] = useState(testData);
    const [currentQuestion, setCurrentQuestion] = useState(testData?.questions[0] || []);

    useEffect(() => {
        const getTest = async () => {
            if (testId?.length > 1) {
                // const { data } = await getLessonTest(testId);
                // setCurrentTest(data?.test);
                // const time = convertToUTC(data?.test?.timeLimit);
                // setDuration(time);
            }
        };
        getTest();
    }, [testId]);


    const handleNext = () => {
        const updatedtest = [...currentTest.questions];
        if (currentQuestion.updateIndex === null) {
            updatedtest?.push(currentQuestion);
            setCurrentTest({ ...currentTest, questions: updatedtest });
            setCurrentQuestion(initialMCQState);
        } else if (
            currentQuestion.updateIndex + 1 ===
            currentTest?.questions?.length
        ) {
            updatedtest[currentQuestion.updateIndex] = currentQuestion;
            setCurrentTest({ ...currentTest, questions: updatedtest });
            setCurrentQuestion(initialMCQState);
        } else {
            updatedtest[currentQuestion.updateIndex] = currentQuestion;
            setCurrentTest({ ...currentTest, questions: updatedtest });
            setCurrentQuestion(
                currentTest?.questions?.[currentQuestion.updateIndex + 1]
            );
        }
    };

    const checkquestionMatch = (index) => {
        if (
            currentQuestion?.updateIndex === index ||
            currentTest?.questions?.indexOf(currentQuestion) === index
        )
            return "#8949ff";
        return "transparent";
    };

    const questionValidation = () => {
        if (
            currentQuestion?.question?.length > 5 &&
            currentQuestion?.correctAnswer &&
            currentQuestion?.options?.length === 4
        )
            return true;
        return false;
    };

    // useEffect(() => {
    //     if (duration?.hours !== 0 || duration?.minutes !== 0) {
    //         const totalSeconds = duration?.hours * 60 * 60 + duration?.minutes * 60;
    //         if (totalSeconds !== undefined) {
    //             setCurrentTest((currentTest) => {
    //                 return { ...currentTest, timeLimit: totalSeconds };
    //             });
    //         }
    //     }
    // }, [duration]);

    console.log(currentTest);
    return (
        <div className="add-test-cnt">
            <div className="test-top">
                <div>
                    <div className="test-name-cnt">
                        <div className='test-info-flex'>
                            <p className='test-info-label'>Course Title</p>
                            <p className='test-info-value'> : {currentTest?.course}</p>
                        </div>
                        <div className='test-info-flex'>
                            <p className='test-info-label'>Student Name</p>
                            <p className='test-info-value'>  : {currentTest?.studentName} </p>
                        </div>
                        <div className='test-info-flex'>
                            <p className='test-info-label'>Student ID</p>
                            <p className='test-info-value'>  : {currentTest?.studentId} </p>
                        </div>
                    </div>
                </div>
                <div className="test-name-cnt">
                    <div className='test-info-flex'>
                        <p className='test-info-label'>Total Marks</p>
                        <p className='test-info-value' style={{ color: "blue", fontSize: "1.2rem" }}> : 100</p>
                    </div>
                    <div className='test-info-flex'>
                        <p className='test-info-label'>Pass Mark</p>
                        <p className='test-info-value' style={{ color: "green", fontSize: "1.2rem" }}>  : 80 </p>
                    </div>
                    <div className='test-info-flex'>
                        <p className='test-info-label'>Scored</p>
                        <p className='test-info-value' style={{ color: "red", fontSize: "1.2rem" }}>  : 10 </p>
                    </div>
                </div>
                <div className="test-name-cnt">
                    <div className='test-info-flex'>
                        <p className='test-info-label'>Time</p>
                        <p className='test-info-value' style={{ color: "orange", fontSize: "1rem" }}> :{currentTest?.timeline}</p>
                    </div>
                    <div className='test-info-flex'>
                        <p className='test-info-label'>finished in</p>
                        <p className='test-info-value' style={{ color: "green", fontSize: "1rem" }}>  : {currentTest?.finishTime}</p>
                    </div>
                </div>
            </div>
            <div className="questions-block-cnt">
                {currentTest?.questions?.map((test, index) => (
                    <div
                        className="question-block"
                        style={{ background: checkquestionMatch(index) }}
                        key={index}
                        onClick={() => setCurrentQuestion({ ...test, updateIndex: index })}
                    ><p
                        key={index}
                        className="question-number"
                        style={{
                            color: checkquestionMatch(index) === "transparent" && "#8949ff",
                        }}
                    >
                            {index + 1}
                        </p>
                    </div>
                ))}
                <div
                    className="question-block"
                    style={{
                        background: checkquestionMatch(null),
                    }}
                >
                    <p
                        className="question-number"
                        style={{
                            color: checkquestionMatch(null) === "transparent" && "#8949ff",
                        }}
                    >
                        {currentTest?.questions?.length + 1}
                    </p>
                </div>
            </div>
            <div className="question-inputs-cnt">
                <div className={`question-input-cnt ${currentQuestion?.type !== 'MCQ' && 'pargaraph-question'}`}>
                    <p>Question</p>
                    <textarea
                        className="question-input"
                        value={currentQuestion?.question}
                        onChange={(e) =>
                            setCurrentQuestion({
                                ...currentQuestion,
                                question: e.target.value,
                            })
                        }
                    />
                </div>
                {
                    currentQuestion?.type !== 'MCQ' && (<div className="choice-cnt">
                        <div className="choice-header">
                            <p>Answers</p>
                            <div className='test-mark-input-cnt'>
                                <p>Marks :</p>
                                <input type='number' className='test-mark-input' placeholder='Mark' />
                            </div>
                        </div>
                        <div className="choice">
                            <p>Choice one</p>
                            <input
                                type="text"
                                placeholder="Enter choice one"
                                value={
                                    currentQuestion?.options[0] ? currentQuestion?.options[0] : ""
                                }
                            />
                        </div>
                        <div className="choice">
                            <p>Choice two</p>
                            <input
                                type="text"
                                name=""
                                placeholder="Enter choice two"
                                value={
                                    currentQuestion?.options[1] ? currentQuestion?.options[1] : ""
                                }
                            />
                        </div>
                        <div className="choice">
                            <p>Choice three</p>
                            <input
                                type="text"
                                name=""
                                placeholder="Enter choice three"
                                value={
                                    currentQuestion?.options[2] ? currentQuestion?.options[2] : ""
                                }
                            />
                        </div>
                        <div className="choice">
                            <p>Choice four</p>
                            <input
                                type="text"
                                name=""
                                placeholder="Enter choice four"
                                value={
                                    currentQuestion?.options[3] ? currentQuestion?.options[3] : ""
                                }
                            />
                        </div>
                    </div>)
                }
            </div>
            <div className="action-btns-cnt">
                <div
                    className=" course-delete-btn cancel-test-btn"
                    onClick={() => closeTest()}
                >
                    Cancel
                </div>
                <div
                    className=" course-delete-btn save-next "
                    onClick={() => handleNext()}
                    style={{
                        background: !questionValidation() && "gray",
                        pointerEvents: !questionValidation() && "none",
                    }}
                >
                    {' Next >'}
                </div>
                <div className="add-new-lesson-btn" >
                    Finish
                </div>
            </div>
        </div>
    )
}

export default TestDetails