import { AppBar, Toolbar, Container } from "@material-ui/core";
// import useStyles from "./Styles";

export default function PublicRouteHeader() {
  return (
    <>
      <AppBar position="static" color="inherit" elevation={10}>
        <Container maxWidth="xl">
          <Toolbar>
            <img
              src="https://www.sumasoft.com/wp-content/uploads/2021/02/suma-soft-logo-1-75x40.png"
              alt="Logo"
            />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
