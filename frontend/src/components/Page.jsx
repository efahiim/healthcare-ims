import styled from 'styled-components';
import Header from './Header';

const Wrapper = styled.div``;

// eslint-disable-next-line react/prop-types
const Page = ({ children }) => {
    return (
        <Wrapper>
            <Header />
            <main>{ children }</main>
        </Wrapper>
    );
};

export default Page;