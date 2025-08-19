const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 ">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          {/* Avatar */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          {/* Header */}
          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16" />
          </div>

          {/* Message Bubble */}
          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[60%] sm:w-[70%] md:w-[200px] lg:w-[300px] max-w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
