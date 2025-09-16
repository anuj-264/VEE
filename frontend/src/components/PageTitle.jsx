const PageTitle = ({ title, highlightedText }) => {
  return (
    <h1 className="text-white mb-10 text-3xl text-center">
      {title}{' '}
      {highlightedText && (
        <span className="text-blue-400">{highlightedText}</span>
      )}
    </h1>
  );
};

export default PageTitle;