var contractStorage = {}

contractStorage.source = `contract testStorage {
    uint ui1;
    uint8 ui8;
    uint16 ui16;
    uint32 ui32;
    uint64 ui64;
    uint128 ui128;
    uint256 ui256;
    uint ui;
    
    int i1;
    int8 i8;
    int16 i16;
    int32 i32;
    int64 i64;
    int128 i128;
    int256 i256;
    int i;
    
    struct strc {
        int i;
        string[2] strArray;
    }
    
    enum en {
        first,
        second,
        third
    }
    en enum1;
    
    bool bo;
    
    address a1;
    
    byte b;
    bytes1 b1;
    bytes8 b8;
    bytes16 b16;
    bytes32 b32;
    
    string str;
    string longStr;
    
    int64[][2] depthArray;
    string[3] strArray;
    
    strc[][2] structArray;
    
    function set() {
        ui1 = 32;
        ui8 = 32;
        ui16 = 123;
        ui32 = 256;
        ui64 = 500;
        ui128 = 2877;
        ui256 = 3467899;
        ui = 123456784534564345;
    
        i1 = 32;
        i8 = -32;
        i16 = -3342;
        i32 = -1;
        i64 = -344442;
        i128 = 3456787698678;
        i256 = -2345667;
        i = -1234546787;
        
        enum1 = en.third;
        bo = true;
        a1 = 0x2AD803b9A828044875245E8EB88183fF74DC5D80;
        
        b = 0xDF;
        b1 = 0x06;
        b8 = 0x0603040AA6;
        b16 = 0x0603040AA60603040AA60603040AA60b0;
        b32 = 0x0603040AA60603040AA60603040AA60b003040AA60603040AA60603040AA60b0;
        str = '_string_';
        longStr = '_string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string__string_';
        
        depthArray[0].length = 3;
        depthArray[1].length = 3;
        depthArray[0][0] = -233333;
        depthArray[0][1] = -233334;
        depthArray[0][2] = -233335;
        depthArray[1][1] = -233436;
        depthArray[1][2] = -233436;
        
        strArray[0] = "value1";
        strArray[1] = "value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_value1_";
        strArray[2] = "value3";
        
        structArray[0].length = 1;
        structArray[1].length = 1;
        strc memory struct1;
        struct1.i = -2345678;
        struct1.strArray[0] = strArray[0];
        struct1.strArray[1] = strArray[1];
        
        strc memory struct2;
        struct2.i = -25678;
        struct2.strArray[0] = strArray[0];
        struct2.strArray[1] = strArray[1];
        
        structArray[0][0] = struct1;
        structArray[1][0] = struct2;        
    }    
}`

contractStorage.storage = {"0x":"0x20","0x01":"0x0b3d00000000000001f400000100007b20","0x02":"0x34ea7b","0x03":"0x01b69b4a9b4b6df9","0x04":"0x20","0x05":"0x0324d89a53f6fffffffffffabe86fffffffff2f2e0","0x06":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffdc353d","0x07":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffb66a4f9d","0x08":"0x0603040aa606df2ad803b9a828044875245e8eb88183ff74dc5d800102","0x09":"0x603040aa60603040aa60603040aa60b0","0x0a":"0x0603040aa60603040aa60603040aa60b003040aa60603040aa60603040aa60b0","0x0b":"0x5f737472696e675f000000000000000000000000000000000000000000000010","0x0c":"0x0241","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c7":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c8":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c9":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8ca":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8cb":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8cc":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8cd":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8ce":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0xdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8cf":"0x5f737472696e675f5f737472696e675f5f737472696e675f5f737472696e675f","0x0d":"0x03","0x0e":"0x03","0xd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5":"0xfffffffffffc7089fffffffffffc708afffffffffffc708b","0xbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd":"0xfffffffffffc7024fffffffffffc70240000000000000000","0x0f":"0x76616c756531000000000000000000000000000000000000000000000000000c","0x10":"0x016d","0x1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae672":"0x76616c7565315f76616c7565315f76616c7565315f76616c7565315f76616c75","0x1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae673":"0x65315f76616c7565315f76616c7565315f76616c7565315f76616c7565315f76","0x1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae674":"0x616c7565315f76616c7565315f76616c7565315f76616c7565315f76616c7565","0x1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae675":"0x315f76616c7565315f76616c7565315f76616c7565315f76616c7565315f7661","0x1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae676":"0x6c7565315f76616c7565315f76616c7565315f76616c7565315f76616c756531","0x1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae677":"0x5f76616c7565315f76616c7565315f76616c7565315f00000000000000000000","0x11":"0x76616c756533000000000000000000000000000000000000000000000000000c","0x12":"0x01","0x13":"0x01","0xbb8a6a4669ba250d26cd7a459eca9d215f8307e33aebe50379bc5a3617ec3444":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffdc3532","0xbb8a6a4669ba250d26cd7a459eca9d215f8307e33aebe50379bc5a3617ec3445":"0x76616c756531000000000000000000000000000000000000000000000000000c","0xbb8a6a4669ba250d26cd7a459eca9d215f8307e33aebe50379bc5a3617ec3446":"0x016d","0x49c01f542f53b5e3c71a08afd453fa65c7702fc02962e0240dabb3b1056bc0e8":"0x76616c7565315f76616c7565315f76616c7565315f76616c7565315f76616c75","0x49c01f542f53b5e3c71a08afd453fa65c7702fc02962e0240dabb3b1056bc0e9":"0x65315f76616c7565315f76616c7565315f76616c7565315f76616c7565315f76","0x49c01f542f53b5e3c71a08afd453fa65c7702fc02962e0240dabb3b1056bc0ea":"0x616c7565315f76616c7565315f76616c7565315f76616c7565315f76616c7565","0x49c01f542f53b5e3c71a08afd453fa65c7702fc02962e0240dabb3b1056bc0eb":"0x315f76616c7565315f76616c7565315f76616c7565315f76616c7565315f7661","0x49c01f542f53b5e3c71a08afd453fa65c7702fc02962e0240dabb3b1056bc0ec":"0x6c7565315f76616c7565315f76616c7565315f76616c7565315f76616c756531","0x49c01f542f53b5e3c71a08afd453fa65c7702fc02962e0240dabb3b1056bc0ed":"0x5f76616c7565315f76616c7565315f76616c7565315f00000000000000000000","0x66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a090":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffdc3532","0x66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a091":"0x76616c756531000000000000000000000000000000000000000000000000000c","0x66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a092":"0x016d","0xb8f15d1452335866d6d4af1ff9af51cb1bd997c7794c596ce90311b19b7febd3":"0x76616c7565315f76616c7565315f76616c7565315f76616c7565315f76616c75","0xb8f15d1452335866d6d4af1ff9af51cb1bd997c7794c596ce90311b19b7febd4":"0x65315f76616c7565315f76616c7565315f76616c7565315f76616c7565315f76","0xb8f15d1452335866d6d4af1ff9af51cb1bd997c7794c596ce90311b19b7febd5":"0x616c7565315f76616c7565315f76616c7565315f76616c7565315f76616c7565","0xb8f15d1452335866d6d4af1ff9af51cb1bd997c7794c596ce90311b19b7febd6":"0x315f76616c7565315f76616c7565315f76616c7565315f76616c7565315f7661","0xb8f15d1452335866d6d4af1ff9af51cb1bd997c7794c596ce90311b19b7febd7":"0x6c7565315f76616c7565315f76616c7565315f76616c7565315f76616c756531","0xb8f15d1452335866d6d4af1ff9af51cb1bd997c7794c596ce90311b19b7febd8":"0x5f76616c7565315f76616c7565315f76616c7565315f00000000000000000000"}

module.exports = contractStorage