

import {Low, Medium, High} from './components/Icons'

export const extractPriority = (priority) => {
	switch(priority)
	{
		case 'could':
		{
			return <Low />
		}

		case 'should':
		{
			return <Medium />
		}

		case 'must':
		{
			return <High />
		}

		default: return null
	}
}
