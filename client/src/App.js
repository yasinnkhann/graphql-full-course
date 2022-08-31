import './App.css';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';
import DisplayData from './DisplayData';

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(err => {
			const { locations, message, path } = err;
			console.warn(
				`[GraphQL Error]:\nMessage: ${message}, Locations: ${locations}, Path: ${path}`
			);
		});
	}

	if (networkError) {
		console.warn(`[Network Error]:\n${networkError}`);
	}
});

const link = from([
	errorLink,
	new HttpLink({ uri: 'http://localhost:4000/graphql' }),
]);

export const client = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					links: relayStylePagination(),
				},
			},
		},
	}),
	link,
});

function App() {
	return (
		<ApolloProvider client={client}>
			<div className='App'>
				<DisplayData />
			</div>
		</ApolloProvider>
	);
}

export default App;
