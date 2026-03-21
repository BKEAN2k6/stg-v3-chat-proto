import {useEffect} from 'react';
import {useTitle} from '@/context/pageTitleContext.js';

type Properties = {
  readonly title: string;
  readonly children?: React.ReactNode;
};

export default function PageTitle({title, children}: Properties) {
  const {setTitle} = useTitle();

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  return (
    <div>
      <h1
        style={{
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          lineHeight: '1.2',
        }}
        className="fs-2 mb-0 mt-2"
      >
        {children ? (
          <span
            style={{
              float: 'right',
              display: 'inline-block',
              verticalAlign: 'top',
              marginLeft: '1rem',
              height: '2rem',
              lineHeight: '2rem',
            }}
            className="float-end ms-3"
          >
            {children}
          </span>
        ) : null}
        {title}
      </h1>
      <hr style={{clear: 'both'}} className="mb-1 mt-1" />
    </div>
  );
}
