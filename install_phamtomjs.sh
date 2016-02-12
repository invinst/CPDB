if ! [ $(phantomjs --version) = 2.1.1 ]; then
    PHANTOM_VERSION="phantomjs-2.1.1"
    ARCH=$(uname -m)
    BIN_PATH="/home/ubuntu/bin/"

    if ! [ $ARCH = "x86_64" ]; then
            $ARCH="i686"
    fi

    PHANTOM_JS="$PHANTOM_VERSION-linux-$ARCH"

    # sudo apt-get update
    # sudo apt-get install build-essential chrpath libssl-dev libxft-dev -y
    # sudo apt-get install libfreetype6 libfreetype6-dev -y
    # sudo apt-get install libfontconfig1 libfontconfig1-dev -y

    if ! [ -e $BIN_PATH$PHANTOM_JS.tar.bz2 ]; then
        wget -P $BIN_PATH https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2
    fi

    if ! [ -d $BIN_PATH$PHANTOM_JS ]; then
        sudo tar -xvjf $BIN_PATH$PHANTOM_JS.tar.bz2 -C $BIN_PATH
    fi

    sudo chmod a+x $BIN_PATH$PHANTOM_JS

    sudo ln -sf $BIN_PATH$PHANTOM_JS/bin/phantomjs /usr/local/bin
fi
echo "PhantomJS version $(phantomjs --version)"
