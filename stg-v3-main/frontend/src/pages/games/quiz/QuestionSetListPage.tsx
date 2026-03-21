import api from '@client/ApiClient';
import {type GetQuestionSetsResponse} from '@client/ApiTypes';
import {useEffect, useState} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button} from 'react-bootstrap';
import PageTitle from '@/components/ui/PageTitle.js';

export default function QuestionSetListPage() {
  const [questionSets, setQuestionSets] = useState<GetQuestionSetsResponse>([]);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      const response = await api.getQuestionSets();
      setQuestionSets(response);
    };

    void fetchQuestionSets();
  }, []);

  const removeQuestionSet = async (id: string) => {
    await api.removeQuestionSet({id});
    setQuestionSets((previous) => previous.filter((qs) => qs.id !== id));
  };

  return (
    <div>
      <PageTitle title="Question Sets">
        <LinkContainer to="/question-sets/new">
          <Button variant="primary">Create New</Button>
        </LinkContainer>
      </PageTitle>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questionSets.map((questionSet) => (
            <tr key={questionSet.id}>
              <td className="w-100">{questionSet.title}</td>
              <td className="d-flex gap-2">
                <LinkContainer to={`/question-sets/${questionSet.id}`}>
                  <Button size="sm" variant="primary">
                    Edit
                  </Button>
                </LinkContainer>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => removeQuestionSet(questionSet.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
