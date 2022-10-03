import { Alert, PermissionsAndroid, Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

export const checkPermission = async (uri) => {
    console.log(uri);
    if (Platform.OS === 'ios') {
      // downloadFile(uri);
      actualDownload(uri);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(uri);
         } else {
          // If permission denied then show alert
          Alert.alert('Error','Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++"+err);
      }
    }
  };

  const actualDownload = (fileUrl) => {
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;    
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL)[0];
   
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const title = `file_${Math.floor(date.getTime() + date.getSeconds() / 2)}.${file_ext}`;

    const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: title,
        path: `${dirToSave}/${title}`,
    }
    const configOptions = Platform.select({
        ios: {
            fileCache: configfb.fileCache,
            title: configfb.title,
            path: configfb.path,
            appendExt: file_ext,
        },
        android: configfb,
    });

    console.log('The file saved to 23233', configfb, dirs);

    RNFetchBlob.config(configOptions)
        .fetch('GET', `${fileUrl}`, {})
        .then((res) => {
            if (Platform.OS === "ios") {
                RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                RNFetchBlob.ios.previewDocument(configfb.path);
            }
            if (Platform.OS == 'android') {
              alert('File Downloaded Successfully.');
            }
            console.log('The file saved to ', res);
        })
        .catch((e) => {
            alert('File Downloaded Failed.');
            console.log('The file saved to ERROR', e.message)
        });
}

const downloadFile = (fileUrl) => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;    
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);
   
    file_ext = '.' + file_ext[0];
   
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir+
          '/file_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,   
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        alert('File Downloaded Successfully.');
      });
  };

const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
  };
