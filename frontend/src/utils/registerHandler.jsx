import { sendEmailCodeBtn, verifyEmailCodeBtn } from "../apis/emialApi";

export const sendCodeBtn = ({ email, onSuccess }) => {
    const handleSendCode = async () => {
        try {
            await sendEmailCodeBtn(email)
            alert('이메일로 전송 성공 3분내 입력 바랍니다.');
            onSuccess();
        } catch (error) {
            console.log('이메일전송 실패:', error);
            alert('이메일 전송에 실패하였습니다.')
        }
    }
    return handleSendCode;
}

export const verifyCodeBtn = ({ email, code, onSuccess}) => {
    const handleVerifyCode = async () => {
        try {
            await verifyEmailCodeBtn(email, code.trim());
            alert('인증번호 확인 완료');
            onSuccess()
        } catch (error) {
            console.log(error);
            alert('인증번호 확인에 실패했습니다.')
        }
    }
    return handleVerifyCode;
}