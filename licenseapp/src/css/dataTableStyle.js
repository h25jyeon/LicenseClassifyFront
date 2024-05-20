const styles = {
    dataTbl: {
      boxShadow: '5px 5px 10px var(--btn-shadow-color)',
      margin: '20px auto',
      width: '100%',
      backgroundColor: 'var(--gray-background-color)',
      cursor:'default',
    },
    tableHeader: {
      display: 'flex',
      fontWeight: 'bold',
    },
    tableHeaderCell: {
      flexShrink:'0',
      padding: '10px',
      backgroundColor: 'var(--light-gray-background-color)',
      borderBottom: '1px solid var(--border-color)',
    },
    tableBody: {
      display: 'flex',
      flexDirection: 'column',
    },
    tableRow: {
      display: 'flex',
      alignItems: 'center',
    },
    tableCell: {
      flexShrink:'0',
      padding: '10px',
    },
    oddRow: {
      backgroundColor: 'var(--light-gray-background-color)',
    },
    index: {
      width: '3%',
      textAlign: 'center',
    },
    licenseType: {
      width: '7%',
      textAlign: 'center',
      wordWrap:'break-word',
    },
    licenseTypes: {
      width: '14%',
      wordWrap:'break-word',
      textAlign: 'left',
    },
    iconBox: {
      width: '60px',
      height: '60px',
      border: '3px solid var(--light-gray-background-color)',
      float:'left',
      margin: '0% 10px 0% 0px',
      lineHeight: '50px',
      textAlign: 'center',
    },
    dataBox: {
      width:'30%',
      height: '100%',
      padding: '10px',
      backgroundColor: 'pink',
    },
    itemData: {
      display: 'block',
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      whiteSpace: 'nowrap',
      cursor: 'grab',
      color: 'var(--gray-text-color)',
      lineHeight:'10px',
    },
    textBold: {
      fontFamily: 'var(--font-SpoqaHanSansNeo-Medium)',
      color: 'var(--default-text-color)',
    },
    evidences: {
      width:'42%',
    },
    btnSearch : {
  
    },
    evidenceLi: {
      clear:'both',
    },
    evidencesBtn: {
      display: 'block',
      float: 'left',
      maxWidth: '70%', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      whiteSpace: 'nowrap',
      paddingLeft: '18px',
      paddingBottom: '10px',
      cursor: 'pointer',
    },
    likeBox: {
      display: 'flex',
      float: 'right',
      width: '30%',
      justifyContent: 'center',
    },
    likeBtn: {
      display: 'block',
      float: 'left',
      paddingRight:'3px',
      cursor: 'pointer',
    },
    exception: {
      cursor: 'pointer',
      color: 'var(--btn-default-color)',
    },
    officialMark: {
      display:'inline-block',
      textIndent: '-18px',
    },
    evidencesLisence: {
      width:'80px',
      display:'inline-block',
      marginRight: '10px',
      fontSize: '12px',
      padding: '2px 0',
      borderRadius: '8px',
      textAlign:'center',
      fontFamily: 'var(--font-SpoqaHanSansNeo-Medium)',
    },
    freeLicense: {
      backgroundColor: 'var(--free)',
    },
    sharewareLicense: {
      backgroundColor: 'var(--shareware)',
    },
    commercialLicense: {
      backgroundColor: 'var(--commercial)',
    },
    etcLicense: {
      backgroundColor: 'var(--etc)',
    },
    exceptionLicense: {
      backgroundColor: 'var(--exception)',
    },
    unknownLicense: {
      backgroundColor: 'var(--unknown)',
    },
    noneLicense: {
      backgroundColor: 'var(--none)',
    },
  };