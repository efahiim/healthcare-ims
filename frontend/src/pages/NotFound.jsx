import Page from "../components/Page";
import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 500px;
    margin: 4rem auto;
    text-align: center;

    h3 {
        margin-bottom: 2rem;
    }
`;

const NotFound = () => {
    return (
        <Page>
            <Wrapper>
                <h3>404 Not Found</h3>
                <p>The page you&apos;re looking for doesn&apos;t exist.</p>
            </Wrapper>
        </Page>
    );
};

export default NotFound;