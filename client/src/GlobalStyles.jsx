import { createGlobalStyle } from "styled-components";

// Global CSS styles for StyledComponents

export const GlobalStyle = createGlobalStyle`
* {
    margin : 0 auto;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arimo', sans-serif;
}

html{
    // overflow:auto; 

}
body{
    overflow-x:hidden; 

    backgorund-color : white;
    width : 100vw;
}

:root{
    height : 100%;
    //COLORS 

    --background : #141523;
    --primary : #19D28F;
    --secondary : #34384b;
    --white : #ffffff;
    --white-dark : #d5d5d5;
    --white-darker : #b1afaf;
    --red : #E32D2A;
    --blue-light : #01adbb;

    //FONTS

    --base-font : 'Arimo', sans-serif;

    //FONTS WEIGHTS

    --txt-400 : 400;
    --txt-500 : 500;
    --txt-600 : 600;
    --txt-700 : 700;

    //TRANSITIONS 
    --fast : 0.4s;



    font-family: var(--font-family);
}


`;
