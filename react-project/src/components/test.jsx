function Header(){
    return(
        <header>
            <h1>Welcome to my website</h1>
            <div>
                <label htmlFor="username">Unsername : </label>
                <input type="text" name="username" id="username"/>
                <br />
                <label htmlFor="password">Password : </label>
                <input type="password" name="password" id="pass"/>
            </div>
        </header>
    );
}

export default Header;