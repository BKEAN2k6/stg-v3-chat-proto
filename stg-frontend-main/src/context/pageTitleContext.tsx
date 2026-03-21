import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';

type TitleContextProps = {
  setTitle: (title: string) => void;
};

const TitleContext = createContext<TitleContextProps | undefined>(undefined);

type Props = {
  readonly children: ReactNode;
};

export function TitleProvider({children}: Props) {
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    document.title = `${title} | See the Good!`;
  }, [title]);

  const value = useMemo(() => ({title, setTitle}), [title, setTitle]);

  return (
    <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
  );
}

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error('useTitle must be used within a TitleProvider');
  }

  return context;
};
