import moment from "moment";

function Message({ message }) {
  return (
    <div>
      <div>
        {message.message}
        <p>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </p>
      </div>
    </div>
  );
}

export default Message;
