import React, { useState, useEffect, useRef } from 'react';

const TimeBox = ({ isCounting, onTimeout }) => {
    const [timeLeft, setTimeLeft] = useState(180);
    const timerRef = useRef(null); // ✅ interval ID 저장
    const calledTimeoutRef = useRef(false);

    useEffect(() => {
        if (isCounting) {
            // 타이머가 이미 실행 중이라면 무시
            if (timerRef.current) return;

            setTimeLeft(180);
            calledTimeoutRef.current = false;

            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;

                        if (!calledTimeoutRef.current) {
                            onTimeout();
                            calledTimeoutRef.current = true;
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // 클린업: isCounting이 false가 되면 타이머 제거
        return () => {
            if (!isCounting && timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isCounting, onTimeout]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div style={{ color: 'red', fontSize: '12px' }}>
            남은시간 {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
};

export default TimeBox;
