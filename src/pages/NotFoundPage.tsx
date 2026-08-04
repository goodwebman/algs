import { Link } from 'react-router';

const NotFoundPage = () => (
  <div className="flex flex-col items-start gap-4 py-16">
    <h1 className="text-3xl font-bold">Страница не найдена</h1>
    <p className="text-muted-foreground">Такой темы или разбора в учебнике нет.</p>
    <Link
      to="/"
      className="inline-flex h-10 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground"
    >
      На главную
    </Link>
  </div>
);

export default NotFoundPage;
