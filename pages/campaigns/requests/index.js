import React,{Component} from 'react';
import Layout from '../../../components/Layout';
import { Button,Table } from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRows';
class RequestIndex extends Component{
    static async getInitialProps(props){
        const {address} = props.query;
        const campaign = Campaign(address);
        const approversCount= await campaign.methods.approversCount().call();
        const requestCount = await campaign.methods.getRequestsCount().call();
        const requests = await Promise.all(Array(parseInt(requestCount)).fill().map((element,index)=>{
            return campaign.methods.requests(index).call();
        })
        );
        return {address,requests,requestCount,approversCount};
    }
    renderRows(){
        return this.props.requests.map((request,index)=>{
            return <RequestRow 
                key={index}
                id={index}
                request={request}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />;
        });
    }
    render(){
        const {Header,Row,HeaderCell,Body}=Table;
        return (
            <Layout>
            <br></br>
                <font color="white"><h3><i>Requests!</i></h3></font>
                <Link route={`/campaigns/${this.props.address}/requests/new`}><a>
                <Button primary floated='right' style={{ marginBottom: 10}}>Add Requests</Button>
                </a></Link>
                <Table>
                <Header><Row>
                <HeaderCell>ID</HeaderCell>    <HeaderCell>Description</HeaderCell>    <HeaderCell>Amount</HeaderCell>  
                <HeaderCell>Recipient</HeaderCell>    <HeaderCell>Approval Count</HeaderCell>    <HeaderCell>Approve</HeaderCell>  <HeaderCell>Finalize</HeaderCell>
                </Row>
                </Header>
            <Body>
            {this.renderRows()}</Body>
                </Table>
                <div>Found {this.props.requestCount} Request!</div>
            </Layout>
            

        );
    }
}
export default RequestIndex;