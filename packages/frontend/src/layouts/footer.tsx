import { Container } from '../components/container'

export const Footer = () => {
  return (
    <Container>
      <p className="text-center text-sm text-muted">
        &#169; {new Date().getFullYear()} Mononymperson. Allright reserved
      </p>
    </Container>
  )
}
