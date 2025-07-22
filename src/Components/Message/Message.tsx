/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { message } from "antd";

interface IMessageProps {
  IsShow: boolean;
  Type: string;
  Message: string;
  setToast: any;
  AfterClose?: any;
}

const CustomMessage: React.FC<IMessageProps> = ({
  IsShow,
  Type,
  Message,
  setToast,
  AfterClose,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  React.useEffect(() => {
    if (IsShow) {
      if (Type === "success") {
        messageApi.open({
          type: "success",
          content: Message,
          onClose: () => {
            AfterClose();
            setToast({
              IsShow: false,
              Type: "",
              Message: "",
            });
          },
          duration: 3,
          style: {
            marginTop: "31px",
          },
        });
      } else if (Type === "error") {
        messageApi.open({
          type: "error",
          content: Message,
          onClose: () => {
            AfterClose();
            setToast({
              IsShow: false,
              Type: "",
              Message: "",
            });
          },
          duration: 3,
        });
      } else {
        messageApi.open({
          type: "warning",
          content: Message,
          onClose: () => {
            AfterClose();
            setToast({
              IsShow: false,
              Type: "",
              Message: "",
            });
          },
          duration: 3,
        });
      }
    }
  }, [Type, IsShow]);
  return <>{contextHolder}</>;
};

export default CustomMessage;
